import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public type OldActor = {
    ownerAdmins : List.List<Principal>;
    ownerEmail : Text;
    isInitialized : Bool;
  };

  public type NewActor = {
    ownerAdmins : List.List<Principal>;
    ownerEmail : Text;
    isInitialized : Bool;
  };

  public func run(old : OldActor) : NewActor {
    {
      ownerAdmins = old.ownerAdmins;
      ownerEmail = old.ownerEmail;
      isInitialized = old.isInitialized;
    };
  };
};
